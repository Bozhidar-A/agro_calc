'use client';

import {
    ActionIcon,
    Box,
    Button,
    Group,
    HoverCard,
    Image,
    LoadingOverlay,
    Menu,
    Modal,
    rem,
    useComputedColorScheme,
    useMantineColorScheme,
} from '@mantine/core';
import classes from '@/components/Header/Header.module.css';
import Link from 'next/link';
import { IconAdjustments, IconAlphabetLatin, IconBrightnessAuto, IconKey, IconLogin2, IconMoon, IconSunHigh } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { styles } from './Header.Mantine';
import { useState } from 'react';
import LoadLangOptions from '../LangList/LangList';




export default function Header() {
    // dark/light modal
    const [openedDarkLight, { open: openDarkLight, close: closeDarkLight }] = useDisclosure(false);
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme();
    const dark = computedColorScheme === 'dark';

    // lang select modal
    const [openedLang, { open: openLang, close: closeLang }] = useDisclosure(false);
    const [loadingLangData, setLoadingLangData] = useState(true);


    return (
        <Box pb={120}>
            <Modal opened={openedDarkLight} onClose={closeDarkLight} centered withCloseButton={false} overlayProps={styles.modalOverlayProps}>
                <Modal.Title style={{ textAlign: 'center', marginBottom: '25px', fontWeight: 700 }}>Color Scheme</Modal.Title>
                <Group justify='space-between' h='100%'>
                    <ActionIcon
                        variant="outline"
                        size='xl'
                        color={dark ? 'yellow' : 'blue'}
                        onClick={() => setColorScheme(dark ? 'light' : 'dark')}
                        title="Toggle color scheme"
                    >
                        {dark ? (
                            <IconSunHigh />
                        ) : (
                            <IconMoon />
                        )}
                    </ActionIcon>
                    <ActionIcon
                        variant="outline"
                        size='xl'
                        color={dark ? 'yellow' : 'blue'}
                        onClick={() => setColorScheme('auto')}
                        title="Auto color scheme"
                    >
                        <IconBrightnessAuto />
                    </ActionIcon>
                </Group>
            </Modal>
            <Modal opened={openedLang} onClose={closeLang} centered withCloseButton={false} overlayProps={styles.modalOverlayProps}>
                <Modal.Title style={styles.centerModalTitle}>Language Select</Modal.Title>
                <LoadingOverlay visible={loadingLangData} zIndex={1000} overlayProps={styles.loadingOverlayProps} />
                <LoadLangOptions loadLangUpdater={setLoadingLangData} />
            </Modal>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Link href="/">
                        <Image
                            radius="md"
                            src={null}
                            h={30}
                            w={30}
                            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                        />
                    </Link>


                    <Group h="100%" gap={0} visibleFrom="sm">
                        <a href="#" className={classes.link}>
                            Home
                        </a>
                        <a href="#" className={classes.link}>
                            Learn
                        </a>
                        <a href="#" className={classes.link}>
                            Academy
                        </a>
                    </Group>

                    <Group visibleFrom='xl'>
                        <Menu key={1} trigger='click'>
                            <Menu.Target>
                                <ActionIcon variant="outline" size="xl" radius="md" aria-label="Settings">
                                    <IconAdjustments className={classes.unauthOptionsIcon} stroke={1.5} />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item leftSection={<IconLogin2 style={styles.dropdownIcons} />}>
                                    <Link href="/auth/login" className={classes.unauthLink}>Log in</Link>
                                </Menu.Item>
                                <Menu.Item leftSection={<IconKey style={styles.dropdownIcons} />}>
                                    <Link href="/auth/register" className={classes.unauthLink}>Sign up</Link>
                                </Menu.Item>
                                <Menu.Item leftSection={<IconAlphabetLatin style={styles.dropdownIcons} />} onClick={openLang}>
                                    <p className={classes.unauthLink} style={{
                                        margin: 0,
                                    }}>Language Select</p>
                                </Menu.Item>
                                <Menu.Item leftSection={<IconLogin2 style={styles.dropdownIcons} />} onClick={openDarkLight}>
                                    <p className={classes.unauthLink} style={{
                                        margin: 0,
                                    }}>Dark/Light Mode</p>
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>


                </Group>
            </header>
        </Box>
    );
}